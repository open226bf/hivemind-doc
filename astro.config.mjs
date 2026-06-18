// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const GITHUB = 'https://github.com/open226bf/hivemind';

// https://astro.build/config
export default defineConfig({
  site: 'https://open226bf.github.io',
  base: '/hivemind-doc',
  integrations: [
    starlight({
      title: 'Hivemind',
      description:
        'Self-service deployment & supervision control plane for Docker Swarm — multi-cluster, agent-ready, single binary.',
      social: [{ icon: 'github', label: 'GitHub', href: GITHUB }],
      editLink: { baseUrl: `${GITHUB}-doc/edit/main/` },
      lastUpdated: true,
      customCss: ['./src/styles/hivemind.css'],
      sidebar: [
        {
          label: 'Start here',
          items: [
            { label: 'Introduction', slug: 'start/introduction' },
            { label: 'Quick start', slug: 'start/quick-start' },
            { label: 'Installation', slug: 'start/installation' },
          ],
        },
        {
          label: 'Using the console',
          items: [
            { label: 'First login & tour', slug: 'using/first-login' },
            { label: 'Your role & permissions', slug: 'using/roles' },
            { label: 'Everyday workflows', slug: 'using/workflows' },
            { label: 'Deploy a service', slug: 'using/deploy-a-service' },
            { label: 'Env, secrets & configs', slug: 'using/secrets-and-configs' },
            { label: 'Live supervision', slug: 'using/supervision' },
            { label: 'The web terminal', slug: 'using/web-terminal' },
            { label: 'Snapshots & rollback', slug: 'using/snapshots-and-rollback' },
            { label: 'Troubleshooting & FAQ', slug: 'using/troubleshooting' },
          ],
        },
        {
          label: 'Concepts',
          items: [
            { label: 'Architecture', slug: 'concepts/architecture' },
            { label: 'Clusters & connection modes', slug: 'concepts/clusters' },
            { label: 'Resources & deployments', slug: 'concepts/resources' },
            { label: 'Access control (RBAC)', slug: 'concepts/rbac' },
            { label: 'Security model', slug: 'concepts/security' },
          ],
        },
        {
          label: 'Operations',
          items: [
            { label: 'Configuration', slug: 'operations/configuration' },
            { label: 'Enroll an agent (NAT)', slug: 'operations/enroll-an-agent' },
            { label: 'Single-image deployment', slug: 'operations/single-image' },
            { label: 'Reverse proxy (HAProxy & nginx)', slug: 'operations/reverse-proxy' },
            { label: 'Production checklist', slug: 'operations/production-checklist' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'REST API', slug: 'reference/api' },
            { label: 'Environment variables', slug: 'reference/environment' },
          ],
        },
        {
          label: 'Contributing',
          items: [
            { label: 'Development setup', slug: 'contributing/development' },
            { label: 'Architecture deep-dive', slug: 'contributing/internals' },
          ],
        },
      ],
    }),
  ],
});
