pipeline {
   agent { 
      docker { 
        image 'mcr.microsoft.com/playwright:v1.58.2-noble' 
      } 
    }
   environment {
      PNPM_HOME = "${WORKSPACE}/.pnpm"
      PATH = "${WORKSPACE}/.pnpm:${PATH}"
   }
   stages {
      stage('install playwright') {
         steps {
            sh 'node --version'
            sh 'pnpm install --frozen-lockfile'
            sh 'pnpm exec playwright install --with-deps'
         }
      }
   }
}