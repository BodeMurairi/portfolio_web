import { configureStore } from '@reduxjs/toolkit';
import aboutReducer from '../services/about';
import projectsReducer from '../services/projects';
import skillsReducer from '../services/skills';
import contactReducer from '../services/contact';
import articlesReducer from '../services/articles';
import adminProfileReducer from '../services/adminProfile';
import experienceReducer from '../services/experience';

const store = configureStore({
  reducer: {
    about: aboutReducer,
    projects: projectsReducer,
    skills: skillsReducer,
    contact: contactReducer,
    articles: articlesReducer,
    adminProfile: adminProfileReducer,
    experience: experienceReducer,
  },
});

export default store;
