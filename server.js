// ===== CONSTANTES FIXAS =====
const express = require('express');
const next = require('next');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./lib/mongodb');
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const app = express();
app.use(cors());
app.use(express.json());

// Esta constante é relativa às coleções da tua base de dados e deves acrescentar mais se for o caso
const Nome = require('./models/Nome');
const Candidate = require('./models/Candidate');



// ===== ENDPOINTS DA API =====

// GET /api/nomes - Retorna todos os nomes existentes
app.get('/api/nomes', async (req, res) => {
  try {
    const nomes = await Nome.find().sort({ nome: 1 });
    res.json(nomes);
  } catch (error) {
    console.error('Erro ao carregar nomes:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// POST /api/nomes - Adiciona um novo nome à coleção "nomes"
app.post('/api/nomes', async (req, res) => {
  try {
    const { nome } = req.body;
    
    if (!nome || !nome.trim()) {
      return res.status(400).json({ erro: 'Nome é obrigatório' });
    }

    const novoNome = new Nome({ nome: nome.trim() });
    const nomeSalvo = await novoNome.save();
    res.status(201).json(nomeSalvo);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ erro: 'Este nome já existe' });
    }
    console.error('Erro ao criar nome:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});



// ===== INICIALIZAÇÃO DO SERVIDOR (também não se deve mexer)=====

// ===== Endpoints do Dashboard do Recrutador =====

function parseNumber(value, fallback = undefined) {
  if (value === undefined) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function buildMatchFromQuery(query) {
  const { search, role, location, min_hard } = query;
  const match = {};

  if (role) match.role = { $regex: role, $options: 'i' };
  if (location) match.location = { $regex: location, $options: 'i' };

  const hard = parseNumber(min_hard);
  if (hard !== undefined) match.hard_score = { $gte: hard };

  if (search) {
    const regex = { $regex: search, $options: 'i' };
    match.$or = [
      { name: regex },
      { role: regex },
      { location: regex },
      { tags: { $elemMatch: regex } },
    ];
  }

  return match;
}

function weightHardFromQuery(query) {
  const wh = parseFloat(query.weight_hard);
  if (Number.isFinite(wh) && wh >= 0 && wh <= 1) return wh;
  return 0.6;
}

// GET /api/candidates - lista de candidatos com filtros e ranking
app.get('/api/candidates', async (req, res) => {
  try {
    const match = buildMatchFromQuery(req.query);
    const weightHard = weightHardFromQuery(req.query);
    const sortBy = (req.query.sort_by || 'total').toLowerCase();
    const order = (req.query.order || 'desc').toLowerCase() === 'asc' ? 1 : -1;
    const limit = Math.min(parseNumber(req.query.limit, 20), 100);
    const page = Math.max(parseNumber(req.query.page, 1), 1);
    const skip = (page - 1) * limit;

    const pipeline = [
      { $match: match },
      {
        $addFields: {
          soft_score: {
            $avg: [
              '$soft_skills.communication',
              '$soft_skills.teamwork',
              '$soft_skills.problem_solving',
              '$soft_skills.adaptability',
              '$soft_skills.leadership',
              '$soft_skills.creativity',
            ],
          },
        },
      },
    ];

    // Filtrar por min_soft depois de calcular soft_score
    const minSoft = parseNumber(req.query.min_soft);
    if (minSoft !== undefined) {
      pipeline.push({ $match: { soft_score: { $gte: minSoft } } });
    }

    pipeline.push({
      $addFields: {
        total_score: {
          $add: [
            { $multiply: [weightHard, '$hard_score'] },
            { $multiply: [{ $subtract: [1, weightHard] }, '$soft_score'] },
          ],
        },
      },
    });

    let sortStage = {};
    if (sortBy === 'hard') sortStage = { hard_score: order };
    else if (sortBy === 'soft') sortStage = { soft_score: order };
    else if (sortBy === 'name') sortStage = { name: order };
    else sortStage = { total_score: order };

    pipeline.push({ $sort: sortStage });
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const results = await Candidate.aggregate(pipeline);
    res.json(results);
  } catch (err) {
    console.error('Erro em GET /api/candidates:', err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// GET /api/kpis - métricas agregadas do conjunto filtrado
app.get('/api/kpis', async (req, res) => {
  try {
    const match = buildMatchFromQuery(req.query);
    const weightHard = weightHardFromQuery(req.query);

    const basePipeline = [
      { $match: match },
      {
        $addFields: {
          soft_score: {
            $avg: [
              '$soft_skills.communication',
              '$soft_skills.teamwork',
              '$soft_skills.problem_solving',
              '$soft_skills.adaptability',
              '$soft_skills.leadership',
              '$soft_skills.creativity',
            ],
          },
        },
      },
      {
        $addFields: {
          total_score: {
            $add: [
              { $multiply: [weightHard, '$hard_score'] },
              { $multiply: [{ $subtract: [1, weightHard] }, '$soft_score'] },
            ],
          },
        },
      },
    ];

    const kpiAgg = await Candidate.aggregate([
      ...basePipeline,
      {
        $group: {
          _id: null,
          average_hard: { $avg: '$hard_score' },
          average_soft: { $avg: '$soft_score' },
          count: { $sum: 1 },
        },
      },
    ]);

    const averages = kpiAgg[0] || { average_hard: null, average_soft: null, count: 0 };

    // Percentil 90 do total_score (threshold top 10%) calculado no Node
    const totals = await Candidate.aggregate([
      ...basePipeline,
      { $project: { total_score: 1 } },
      { $sort: { total_score: 1 } },
    ]);

    let top10Threshold = null;
    if (totals.length > 0) {
      const idx = Math.min(
        totals.length - 1,
        Math.ceil(0.9 * totals.length) - 1
      );
      top10Threshold = totals[idx].total_score;
    }

    res.json({
      average_hard: averages.average_hard,
      average_soft: averages.average_soft,
      top10_percent_threshold: top10Threshold,
      count: averages.count,
    });
  } catch (err) {
    console.error('Erro em GET /api/kpis:', err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// GET /api/candidates/:id - detalhe do candidato
app.get('/api/candidates/:id', async (req, res) => {
  try {
    const doc = await Candidate.findById(req.params.id);
    if (!doc) return res.status(404).json({ erro: 'Candidato não encontrado' });
    const softValues = Object.values(doc.soft_skills || {});
    const soft_score =
      softValues.length > 0
        ? softValues.reduce((a, b) => a + b, 0) / softValues.length
        : 0;
    const weightHard = weightHardFromQuery(req.query);
    const total_score = weightHard * doc.hard_score + (1 - weightHard) * soft_score;
    res.json({ ...doc.toObject(), soft_score, total_score });
  } catch (err) {
    console.error('Erro em GET /api/candidates/:id:', err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// POST /api/candidates - criar candidato
app.post('/api/candidates', async (req, res) => {
  try {
    const body = req.body || {};

    function clamp01to100(v) {
      const n = Number(v);
      if (!Number.isFinite(n)) return null;
      return Math.max(0, Math.min(100, n));
    }

    const soft = body.soft_skills || {};
    const prefRaw = String(body.preference || '').toLowerCase();
    const allowedPrefs = ['remote', 'presencial', 'hybrid'];
    const preference = allowedPrefs.includes(prefRaw) ? prefRaw : 'presencial';
    const cleaned = {
      name: String(body.name || '').trim(),
      role: String(body.role || '').trim(),
      location: String(body.location || '').trim(),
      years_experience: parseNumber(body.years_experience, 0),
      tags: Array.isArray(body.tags)
        ? body.tags.map((t) => String(t).trim()).filter(Boolean)
        : [],
      hard_score: clamp01to100(body.hard_score),
      soft_skills: {
        communication: clamp01to100(soft.communication),
        teamwork: clamp01to100(soft.teamwork),
        problem_solving: clamp01to100(soft.problem_solving),
        adaptability: clamp01to100(soft.adaptability),
        leadership: clamp01to100(soft.leadership),
        creativity: clamp01to100(soft.creativity),
      },
      preference,
    };

    if (!cleaned.name || !cleaned.role || !cleaned.location) {
      return res.status(400).json({ erro: 'Campos obrigatórios: name, role, location' });
    }
    if (cleaned.hard_score === null) {
      return res.status(400).json({ erro: 'hard_score inválido (0-100)' });
    }
    for (const [k, v] of Object.entries(cleaned.soft_skills)) {
      if (v === null) return res.status(400).json({ erro: `soft_skills.${k} inválido (0-100)` });
    }

    const created = await Candidate.create(cleaned);
    res.status(201).json(created);
  } catch (err) {
    console.error('Erro em POST /api/candidates:', err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// POST /api/seed - inserir 20 candidatos de exemplo
app.post('/api/seed', async (req, res) => {
  try {
    const shouldReset = String(req.query.reset || 'false').toLowerCase() === 'true';
    if (shouldReset) {
      await Candidate.deleteMany({});
    }

    let sample = [
      { name: 'Ana Silva', role: 'Frontend Developer', location: 'São Paulo', years_experience: 3, tags: ['react', 'ui', 'css'], hard_score: 92, soft_skills: { communication: 78, teamwork: 62, problem_solving: 69, adaptability: 74, leadership: 50, creativity: 88 } },
      { name: 'Bruno Costa', role: 'Backend Developer', location: 'Rio de Janeiro', years_experience: 5, tags: ['node', 'api', 'docker'], hard_score: 86, soft_skills: { communication: 55, teamwork: 72, problem_solving: 93, adaptability: 60, leadership: 62, creativity: 48 } },
      { name: 'Carla Ramos', role: 'Data Scientist', location: 'Lisboa', years_experience: 4, tags: ['python', 'ml', 'stats'], hard_score: 95, soft_skills: { communication: 70, teamwork: 58, problem_solving: 96, adaptability: 66, leadership: 45, creativity: 62 } },
      { name: 'Diego Nunes', role: 'DevOps Engineer', location: 'Porto', years_experience: 6, tags: ['k8s', 'ci/cd', 'cloud'], hard_score: 78, soft_skills: { communication: 52, teamwork: 88, problem_solving: 83, adaptability: 92, leadership: 71, creativity: 40 } },
      { name: 'Eduarda Lopes', role: 'Product Manager', location: 'Curitiba', years_experience: 7, tags: ['roadmap', 'stakeholders'], hard_score: 68, soft_skills: { communication: 96, teamwork: 92, problem_solving: 74, adaptability: 86, leadership: 90, creativity: 85 } },
      { name: 'Fernando Alves', role: 'Fullstack Developer', location: 'Belo Horizonte', years_experience: 4, tags: ['node', 'react', 'sql'], hard_score: 74, soft_skills: { communication: 61, teamwork: 70, problem_solving: 76, adaptability: 58, leadership: 42, creativity: 55 } },
      { name: 'Gabriela Dias', role: 'UX Designer', location: 'São Paulo', years_experience: 5, tags: ['ux', 'research', 'figma'], hard_score: 62, soft_skills: { communication: 94, teamwork: 88, problem_solving: 60, adaptability: 84, leadership: 48, creativity: 98 } },
      { name: 'Henrique Souza', role: 'Mobile Developer', location: 'Rio de Janeiro', years_experience: 3, tags: ['react-native', 'ios', 'android'], hard_score: 79, soft_skills: { communication: 66, teamwork: 74, problem_solving: 82, adaptability: 70, leadership: 53, creativity: 69 } },
      { name: 'Isabela Rocha', role: 'QA Engineer', location: 'Lisboa', years_experience: 4, tags: ['testing', 'automation'], hard_score: 71, soft_skills: { communication: 77, teamwork: 85, problem_solving: 73, adaptability: 90, leadership: 44, creativity: 58 } },
      { name: 'João Pedro', role: 'Security Engineer', location: 'Porto', years_experience: 6, tags: ['security', 'pentest'], hard_score: 90, soft_skills: { communication: 49, teamwork: 55, problem_solving: 94, adaptability: 52, leadership: 50, creativity: 45 } },
      { name: 'Karen Martins', role: 'Data Engineer', location: 'São Paulo', years_experience: 5, tags: ['etl', 'spark', 'cloud'], hard_score: 88, soft_skills: { communication: 64, teamwork: 72, problem_solving: 86, adaptability: 78, leadership: 61, creativity: 57 } },
      { name: 'Lucas Moreira', role: 'Frontend Developer', location: 'Curitiba', years_experience: 2, tags: ['js', 'react', 'html'], hard_score: 67, soft_skills: { communication: 80, teamwork: 68, problem_solving: 54, adaptability: 66, leadership: 40, creativity: 82 } },
      { name: 'Mariana Teixeira', role: 'Product Designer', location: 'Lisboa', years_experience: 6, tags: ['ui', 'ux', 'research'], hard_score: 64, soft_skills: { communication: 97, teamwork: 93, problem_solving: 62, adaptability: 92, leadership: 52, creativity: 99 } },
      { name: 'Nuno Campos', role: 'Backend Developer', location: 'Porto', years_experience: 5, tags: ['api', 'db', 'node'], hard_score: 84, soft_skills: { communication: 58, teamwork: 66, problem_solving: 88, adaptability: 60, leadership: 55, creativity: 50 } },
      { name: 'Olivia Santos', role: 'Data Scientist', location: 'Rio de Janeiro', years_experience: 3, tags: ['ml', 'nlp'], hard_score: 93, soft_skills: { communication: 72, teamwork: 60, problem_solving: 95, adaptability: 69, leadership: 48, creativity: 76 } },
      { name: 'Paulo Henrique', role: 'DevOps Engineer', location: 'São Paulo', years_experience: 7, tags: ['k8s', 'terraform', 'observability'], hard_score: 81, soft_skills: { communication: 60, teamwork: 78, problem_solving: 85, adaptability: 91, leadership: 76, creativity: 55 } },
      { name: 'Queila Barros', role: 'Scrum Master', location: 'Belo Horizonte', years_experience: 8, tags: ['agile', 'scrum'], hard_score: 63, soft_skills: { communication: 98, teamwork: 95, problem_solving: 58, adaptability: 94, leadership: 92, creativity: 66 } },
      { name: 'Rafael Pinto', role: 'Fullstack Developer', location: 'Porto', years_experience: 4, tags: ['react', 'node', 'docker'], hard_score: 76, soft_skills: { communication: 62, teamwork: 70, problem_solving: 82, adaptability: 64, leadership: 51, creativity: 60 } },
      { name: 'Sofia Almeida', role: 'UX Researcher', location: 'Lisboa', years_experience: 5, tags: ['research', 'ux'], hard_score: 60, soft_skills: { communication: 99, teamwork: 90, problem_solving: 56, adaptability: 88, leadership: 46, creativity: 97 } },
      { name: 'Tiago Vieira', role: 'Mobile Developer', location: 'Curitiba', years_experience: 3, tags: ['android', 'kotlin'], hard_score: 82, soft_skills: { communication: 68, teamwork: 72, problem_solving: 86, adaptability: 62, leadership: 55, creativity: 59 } },
    ];

    const prefs = ['remote','presencial','hybrid'];
    const sampleWithPrefs = sample.map((c,i)=>({ ...c, preference: prefs[i % prefs.length] }));
    const inserted = await Candidate.insertMany(sampleWithPrefs);
    res.status(201).json({ inserted: inserted.length });
  } catch (err) {
    console.error('Erro em POST /api/seed:', err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

app.use((req, res) => {
  return handle(req, res);
});

const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
  try {
    await connectDB();
    await nextApp.prepare();
    app.listen(PORT, () => {
      console.log(`Servidor Next.js + Express a correr em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

iniciarServidor();


