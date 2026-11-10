export const stackExperience = {
  frequent: { label: '자주 사용', description: '프로젝트 3회 이상' },
  applied: { label: '프로젝트 적용', description: '프로젝트 1~2회' },
  practiced: { label: '실습 경험', description: '학습 과정에서 사용' },
  tool: { label: '협업 도구', description: '적용 횟수 구분 없음' },
};

export const techStack = [
  {
    title: 'Language',
    items: [
      { name: 'Python', experience: 'frequent' },
      { name: 'Java', experience: 'applied' },
    ],
  },
  {
    title: 'Data Processing',
    items: [
      { name: 'pandas', experience: 'frequent' },
      { name: 'NumPy', experience: 'frequent' },
      { name: 'Apache Airflow', experience: 'applied' },
      { name: 'Spark', experience: 'applied' },
      { name: 'Hadoop', experience: 'applied' },
    ],
  },
  {
    title: 'Database & Storage',
    items: [
      { name: 'PostgreSQL', experience: 'frequent' },
      { name: 'MariaDB', experience: 'frequent' },
      { name: 'ChromaDB', experience: 'frequent' },
      { name: 'Neo4j', experience: 'frequent' },
      { name: 'Redis', experience: 'applied' },
      { name: 'Iceberg', experience: 'practiced' },
      { name: 'MongoDB', experience: 'practiced' },
    ],
  },
  {
    title: 'LLM & ML',
    items: [
      { name: 'LangChain', experience: 'frequent' },
      { name: 'LangGraph', experience: 'frequent' },
      { name: 'PyTorch', experience: 'frequent' },
      { name: 'LangSmith', experience: 'applied' },
      { name: 'TensorFlow', experience: 'applied' },
    ],
  },
  {
    title: 'Infrastructure & Monitoring',
    items: [
      { name: 'Docker', experience: 'frequent' },
      { name: 'GitHub Actions', experience: 'frequent' },
      { name: 'Prometheus', experience: 'applied' },
      { name: 'Grafana', experience: 'applied' },
    ],
  },
  {
    title: 'Collaboration',
    items: [
      { name: 'Notion', experience: 'tool' },
      { name: 'Confluence', experience: 'tool' },
      { name: 'Jira', experience: 'tool' },
      { name: 'Slack', experience: 'tool' },
    ],
  },
];
