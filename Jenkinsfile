pipeline {
   agent { 
      docker { 
        image 'mcr.microsoft.com/playwright:v1.58.2-noble' 
      } 
    }
   stages {
      stage('install playwright') {
         steps {
            sh 'node --version'
            sh 'curl -fsSL https://get.pnpm.io/install.sh | sh -'
            sh 'pnpm install --frozen-lockfile'
            sh 'pnpm exec playwright install --with-deps'
         }
      }
   }
}