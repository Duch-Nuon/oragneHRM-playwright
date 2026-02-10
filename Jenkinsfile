pipeline {
    agent any
    
    options {
        timeout(time: 60, unit: 'MINUTES')
    }
    
    environment {
        BASE_URL = credentials('BASE_URL')
        ORANGEHRM_USER = credentials('ORANGEHRM_USER')
        ORANGEHRM_PASS = credentials('ORANGEHRM_PASS')
        BASE_MAIL_URL = credentials('BASE_MAIL_URL')
        TELEGRAM_BOT_TOKEN = credentials('TELEGRAM_BOT_TOKEN')
        TELEGRAM_CHAT_ID = credentials('TELEGRAM_CHAT_ID')
    }
    
    tools {
        nodejs 'NodeJS-LTS' // Configure this name in Jenkins Global Tool Configuration
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Enable Corepack') {
            steps {
                sh 'corepack enable'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'pnpm install --frozen-lockfile'
            }
        }
        
        stage('Install Playwright Browsers') {
            steps {
                sh 'pnpm exec playwright install --with-deps'
            }
        }
        
        stage('Run Playwright Tests') {
            steps {
                script {
                    sh 'pnpm exec playwright test --reporter=list | tee test-summary.txt'
                }
            }
        }
    }
    
    post {
        always {
            script {
                def summary = sh(
                    script: 'tail -n 30 test-summary.txt',
                    returnStdout: true
                ).trim()
                
                // Add emojis for pass/fail/skipped
                summary = summary.replaceAll(/(?m)^  ✓/, '✅')
                                .replaceAll(/(?m)^  ✗/, '❌')
                                .replaceAll(/(?m)^  -/, '⚠️')
                
                // Escape for MarkdownV2
                def escapedSummary = summary.replaceAll(/[`*_\[\]()~>#+=|{}.!-]/) { "\\\\" + it }
                
                def message = "*Playwright Test Results:*\\n\\n\`\`\`\\n${escapedSummary}\\n\`\`\`"
                
                sh """
                    curl -s -X POST "https://api.telegram.org/bot\${TELEGRAM_BOT_TOKEN}/sendMessage" \\
                        -d chat_id="\${TELEGRAM_CHAT_ID}" \\
                        --data-urlencode text="${message}" \\
                        -d parse_mode="MarkdownV2"
                """
            }
        }
    }
}