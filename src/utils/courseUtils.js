export const getModuleProgress = (module) => {
    if (!module.topics || module.topics.length === 0) return 0;
    const completedTopics = module.topics.filter(t => t.completed).length;
    return Math.round((completedTopics / module.topics.length) * 100);
};

export const getCourseProgress = (course) => {
    if (!course.modules || course.modules.length === 0) return 0;
    const allTopics = course.modules.flatMap(m => m.topics || []);
    if (allTopics.length === 0) return 0;
    const completedTopics = allTopics.filter(t => t.completed).length;
    return Math.round((completedTopics / allTopics.length) * 100);
};