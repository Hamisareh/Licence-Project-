// controllers/evaluationController.js
const Evaluation = require('../models/evaluation');

exports.getStudentEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.getByStudent(req.user.id);
    res.json({ success: true, data: evaluations });
  } catch (err) {
    console.error("Erreur:", err);
    res.status(500).json({ 
      success: false,
      message: "Erreur serveur" 
    });
  }
};