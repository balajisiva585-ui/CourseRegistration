import mongoose from 'mongoose';

const tneaFavoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TneaCollege',
      required: true,
    },
    collegeCode: {
      type: String,
      required: true,
    },
    savedDepartments: [
      {
        type: String,
      },
    ],
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// One favorite per user per college
tneaFavoriteSchema.index({ user: 1, college: 1 }, { unique: true });

const TneaFavorite = mongoose.model('TneaFavorite', tneaFavoriteSchema);
export default TneaFavorite;
