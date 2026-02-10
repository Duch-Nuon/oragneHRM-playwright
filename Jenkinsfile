pipeline {
  agent { docker { image 'mcr.microsoft.com/playwright:v1.58.2-noble' } }

  options {
    timestamps()
    timeout(time: 60, unit: 'MINUTES')
  }

  environment {
    CI = 'true'
    // If your tests need these envs during runtime, define them here:
    BASE_URL       = credentials('BASE_URL')
    ORANGEHRM_USER = credentials('ORANGEHRM_USER')
    ORANGEHRM_PASS = credentials('ORANGEHRM_PASS')
    BASE_MAIL_URL  = credentials('BASE_MAIL_URL')

    // pnpm user-space path
    PNPM_HOME = "${WORKSPACE}/.pnpm"
    PATH = "${WORKSPACE}/.pnpm:${env.PATH}"
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
          set -euo pipefail

          node -v

          # Install pnpm into workspace (no /usr/bin, no sudo)
          mkdir -p "$PNPM_HOME"
          curl -fsSL https://get.pnpm.io/install.sh | env PNPM_HOME="$PNPM_HOME" SHELL=bash sh -

          pnpm -v
          pnpm install --frozen-lockfile
        '''
      }
    }

    stage('Install Playwright Browsers') {
      steps {
        sh '''
          set -euo pipefail
          pnpm exec playwright install --with-deps
        '''
      }
    }

    stage('Run Playwright tests (capture output)') {
      steps {
        sh '''
          set -euo pipefail
          mkdir -p test-results
          pnpm exec playwright test --reporter=list | tee test-summary.txt
        '''
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'test-summary.txt,playwright-report/**,test-results/**', allowEmptyArchive: true

      withCredentials([
        string(credentialsId: 'TELEGRAM_BOT_TOKEN', variable: 'TELEGRAM_BOT_TOKEN'),
        string(credentialsId: 'TELEGRAM_CHAT_ID', variable: 'TELEGRAM_CHAT_ID')
      ]) {
        sh '''
          set -euo pipefail

          SUMMARY=$(tail -n 30 test-summary.txt || true)
          SUMMARY=$(echo "$SUMMARY" | sed 's/^  ✓/✅/g' | sed 's/^  ✗/❌/g' | sed 's/^  -/⚠️/g')

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
