// packages/shared/src/types/project.js
// 단순 JavaScript 객체로 정의
exports.ProjectStatus = {
  PLANNING: 'planning',
  IN_PROGRESS: 'inProgress',
  COMPLETED: 'completed'
};

// TypeScript 인터페이스가 아닌 JSDoc 주석으로 타입 문서화
/**
 * @typedef {Object} Project
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {string} location
 * @property {string} client
 * @property {number} year
 * @property {string} status
 * @property {number} [categoryId]
 * @property {Object} [category]
 * @property {number} category.id
 * @property {string} category.name
 * @property {string} [category.description]
 * @property {Array<Object>} [images]
 * @property {number} images.id
 * @property {string} images.url
 * @property {string} [images.description]
 * @property {boolean} images.isFeatured
 */

// 빈 프로젝트 객체를 예시로 내보내기 (참조용)
exports.ProjectExample = {
  id: 0,
  title: '',
  description: '',
  location: '',
  client: '',
  year: 0,
  status: '',
  categoryId: 0,
  category: {
    id: 0,
    name: '',
    description: ''
  },
  images: [
    {
      id: 0,
      url: '',
      description: '',
      isFeatured: false
    }
  ]
};