const mongoose = require('mongoose');

const softSkillsSchema = new mongoose.Schema(
  {
    communication: { type: Number, min: 0, max: 100, required: true },
    teamwork: { type: Number, min: 0, max: 100, required: true },
    problem_solving: { type: Number, min: 0, max: 100, required: true },
    adaptability: { type: Number, min: 0, max: 100, required: true },
    leadership: { type: Number, min: 0, max: 100, required: true },
    creativity: { type: Number, min: 0, max: 100, required: true },
  },
  { _id: false }
);

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    role: { type: String, required: true, index: true },
    location: { type: String, required: true, index: true },
    years_experience: { type: Number, min: 0, max: 60, default: 0 },
    tags: { type: [String], default: [] },
    hard_score: { type: Number, min: 0, max: 100, required: true },
    soft_skills: { type: softSkillsSchema, required: true },
    preference: { type: String, enum: ['remote', 'presencial', 'hybrid'], default: 'presencial', index: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

module.exports =
  mongoose.models.Candidate || mongoose.model('Candidate', candidateSchema);

