pipeline {
    agent any
    environment {
        version = '1.0'
    }

    stages {
        stage("login") {
            steps {
                echo 'authenticating into jenkins server...'
                sh 'docker login'
            }
        }

        stage("build") {
            steps {
                echo 'building the application...'
                sh "docker build -t capstone-mailer:${version} ."
                sh "docker tag capstone-mailer:${version} stoicllama/capstone-mailer:${version}"
                sh "docker push stoicllama/capstone-mailer:${version}"
            }
        }

        stage("test") {
            steps {
                echo 'testing the application...'    
            }
        }

        stage("deploy") {
            steps {
                echo 'deploying the application...' 

                script {
                    // make sure to update containerName to the app
                    def containerName = 'capstone-mailer'

                    def containerExists = sh(returnStdout: true, script: "docker ps -q --filter name=${containerName}")

                    if (containerExists.length() != 0) {
                        // Stop the Docker container
                        sh "docker stop ${containerName}"
                        echo "Container stopped successfully. Continuing..."
                    } else {
                        echo "Container does not exist. Continuing..."
                    }
                }

                // Use the withCredentials block to access the credentials
                // Note: need --rm when docker run.. so that docker stop can kill it cleanly
               withCredentials([
                    string(credentialsId: 'website', variable: 'WEBSITE'),
                    string(credentialsId: 'mailerEmail', variable: 'MAILEREMAIL'),
                    string(credentialsId: 'mailerPass', variable: 'MAILERPASS'),
                ]) {

                    sh '''
                        ssh -i /var/jenkins_home/.ssh/website_deploy_rsa_key ${WEBSITE} "docker run -d \
                        -p 7000:7000 \
                        --rm \
                        -e EMAIL=${MAILEREMAIL} \
                        -e PASSWORD=${MAILERPASS} \
                        --name capstone-mailer \
                        --network monitoring \
                        -v /var/run/docker.sock:/var/run/docker.sock \
                        stoicllama/capstone-mailer:${version}

                        docker ps
                        "
                    '''
                }
            }
        }
    }

    post {
        always {
            echo "Release finished and start clean up"
            deleteDir() // the actual folder with the downloaded project code is deleted from build server
        }
        success {
            echo "Release Success"
        }
        failure {
            echo "Release Failed"
        }
        cleanup {
            echo "Clean up in post workspace" 
            cleanWs() // any reference this particular build is deleted from the agent
        }
    }

}