pipeline {
   agent { 
      docker { 
        image 'mcr.microsoft.com/playwright:v1.58.2-noble' 
      } 
    }
   stages {
      stage('install playwright') {
         steps {
            sh 'pnpm install --frozen-lockfile'
            sh 'pnpm exec playwright install --with-deps'
         }
      }
   }
}