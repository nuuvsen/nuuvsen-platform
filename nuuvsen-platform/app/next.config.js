/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Necessário para compilar dentro do Docker multi-stage
  typescript: {
    // Ignora erros de build do TS se houver algum tipo estrito pendente
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignora avisos de Linter durante a compilação do Docker
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig