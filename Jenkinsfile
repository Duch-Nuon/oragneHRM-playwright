pipeline {
   agent { 
      docker { 
        image 'mcr.microsoft.com/playwright:v1.58.2-noble'
        args '--user root'
      } 
   }
   
   environment {
      BASE_URL = credentials('BASE_URL')
      ORANGEHRM_USER = credentials('ORANGEHRM_USER')
      ORANGEHRM_PASS = credentials('ORANGEHRM_PASS')
      BASE_MAIL_URL = credentials('BASE_MAIL_URL')
      TELEGRAM_BOT_TOKEN = credentials('TELEGRAM_BOT_TOKEN')
      TELEGRAM_CHAT_ID = credentials('TELEGRAM_CHAT_ID')
   }
   
   options {
      timeout(time: 60, unit: 'MINUTES')
   }
   
   stages {
      stage('Checkout') {
         steps {
            checkout scm
         }
      }
      
      stage('Setup') {
         steps {
            sh 'node --version'
            sh 'corepack enable'
            sh 'corepack prepare pnpm@latest --activate'
            sh 'pnpm install --frozen-lockfile'
            sh 'pnpm exec playwright install --with-deps'
         }
      }
      
      stage('Run Tests') {
         steps {
            sh 'pnpm exec playwright test --reporter=list | tee test-summary.txt'
         }
      }
   }
   
   post {
      always {
         script {
            sh '''#!/bin/bash
               SUMMARY=$(tail -n 30 test-summary.txt)
               # Add emojis for pass/fail/skipped
               SUMMARY=$(echo "$SUMMARY" | sed 's/^  ✓/✅/g' | sed 's/^  ✗/❌/g' | sed 's/^  -/⚠️/g')
               # Escape for MarkdownV2
               ESCAPED_SUMMARY=$(printf '%s' "$SUMMARY" | sed -e 's/`/\\\\`/g' -e 's/\\*/\\\\*/g' -e 's/_/\\\\_/g' -e 's/\\[/\\\\[/g' -e 's/\\]/\\\\]/g' -e 's/(/\\\\(/g' -e 's/)/\\\\)/g' -e 's/~/\\\\~/g' -e 's/>/\\\\>/g' -e 's/#/\\\\#/g' -e 's/\\+/\\\\+/g' -e 's/-/\\\\-/g' -e 's/=/\\\\=/g' -e 's/|/\\\\|/g' -e 's/{/\\\\{/g' -e 's/}/\\\\}/g' -e 's/\\./\\\\./g' -e 's/!/\\\\!/g')
               MESSAGE=$(printf "*Playwright Test Results:*\\n\\n\\`\\`\\`\\n%s\\n\\`\\`\\`" "$ESCAPED_SUMMARY")
               curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \\
                 -d chat_id="${TELEGRAM_CHAT_ID}" \\
                 --data-urlencode text="$MESSAGE" \\
                 -d parse_mode="MarkdownV2"
            '''
         }
      }
   }
}