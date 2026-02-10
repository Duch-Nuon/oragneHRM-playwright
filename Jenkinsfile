pipeline {
  agent { docker { image 'mcr.microsoft.com/playwright:v1.58.2-noble' } }

  options {
    timestamps()
    timeout(time: 60, unit: 'MINUTES')
  }

  environment {
    CI = 'true'
    npm_config_cache = '${WORKSPACE}/.npm-cache'
    PNPM_HOME = '${WORKSPACE}/.pnpm-home'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install (pnpm)') {
      steps {
        sh '''
          node -v
          npx pnpm install --frozen-lockfile
        '''
      }
    }

    stage('Install Playwright Browsers') {
      steps {
        // In Playwright docker image this is usually already OK,
        // but keeping it matches your GitHub Actions.
        sh 'npx pnpm exec playwright install --with-deps'
      }
    }

    stage('Run Playwright tests (capture output)') {
      steps {
        withCredentials([
          string(credentialsId: 'BASE_URL', variable: 'BASE_URL'),
          string(credentialsId: 'ORANGEHRM_USER', variable: 'ORANGEHRM_USER'),
          string(credentialsId: 'ORANGEHRM_PASS', variable: 'ORANGEHRM_PASS'),
          string(credentialsId: 'BASE_MAIL_URL', variable: 'BASE_MAIL_URL')
        ]) {
          sh '''
            mkdir -p test-results
            npx pnpm exec playwright test --reporter=list | tee test-summary.txt
          '''
        }
      }
    }
  }

  post {
    always {
      // Archive artifacts for debugging
      archiveArtifacts artifacts: 'test-summary.txt,playwright-report/**,test-results/**', allowEmptyArchive: true

      // Send Telegram summary (equivalent to your GitHub Actions step)
      withCredentials([
        string(credentialsId: 'BASE_URL', variable: 'BASE_URL'),
        string(credentialsId: 'ORANGEHRM_USER', variable: 'ORANGEHRM_USER'),
        string(credentialsId: 'ORANGEHRM_PASS', variable: 'ORANGEHRM_PASS'),
        string(credentialsId: 'BASE_MAIL_URL', variable: 'BASE_MAIL_URL'),
        string(credentialsId: 'TELEGRAM_BOT_TOKEN', variable: 'TELEGRAM_BOT_TOKEN'),
        string(credentialsId: 'TELEGRAM_CHAT_ID', variable: 'TELEGRAM_CHAT_ID')
      ]) {
        sh '''
          # Take last 30 lines like your workflow
          SUMMARY=$(tail -n 30 test-summary.txt || true)

          # Add emojis
          SUMMARY=$(echo "$SUMMARY" | sed 's/^  ✓/✅/g' | sed 's/^  ✗/❌/g' | sed 's/^  -/⚠️/g')

          # Escape for MarkdownV2 (same idea as your YAML)
          ESCAPED_SUMMARY=$(printf '%s' "$SUMMARY" | sed -e 's/`/\\\\`/g' -e 's/\\*/\\\\*/g' -e 's/_/\\\\_/g' -e 's/\\[/\\\\[/g' -e 's/\\]/\\\\]/g' -e 's/(/\\\\(/g' -e 's/)/\\\\)/g' -e 's/~/\\\\~/g' -e 's/>/\\\\>/g' -e 's/#/\\\\#/g' -e 's/\\+/\\\\+/g' -e 's/-/\\\\-/g' -e 's/=/\\\\=/g' -e 's/|/\\\\|/g' -e 's/{/\\\\{/g' -e 's/}/\\\\}/g' -e 's/\\./\\\\./g' -e 's/!/\\\\!/g')

          MESSAGE=$(printf "*Playwright Test Results:*\\n\\n\\`\\`\\`\\n%s\\n\\`\\`\\`" "$ESCAPED_SUMMARY")

          curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
            -d chat_id="${TELEGRAM_CHAT_ID}" \
            --data-urlencode text="$MESSAGE" \
            -d parse_mode="MarkdownV2" >/dev/null || true
        '''
      }
    }
  }
}
