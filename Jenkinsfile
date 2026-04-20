pipeline {
    agent any

    environment {
        STAGING_SERVER = "devops@54.82.62.43"
        // PROD_SERVER is now handled by kubectl via kubeconfig
        IMAGE_FRONTEND = "atishkhade05/frontend"
        IMAGE_CONTACT = "atishkhade05/contact-service"
    }

    stages {
        stage('Clone Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/atish-khade/atish-portfolio-website.git'
            }
        }

        stage('Build & Push Images') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                    docker login -u $DOCKER_USER -p $DOCKER_PASS
                    docker build -t ${IMAGE_FRONTEND}:latest ./frontend
                    docker build -t ${IMAGE_CONTACT}:latest ./contact-service
                    docker push ${IMAGE_FRONTEND}:latest
                    docker push ${IMAGE_CONTACT}:latest
                    """
                }
            }
        }

        stage('Deploy to Staging (VM2)') {
            steps {
                sshagent(['ssh-key-id']) {
                    sh """
                    ssh ${STAGING_SERVER} '
                        cd ~/atish-portfolio-website &&
                        git pull origin main &&
                        docker-compose -f docker-compose.staging.yml pull &&
                        docker-compose -f docker-compose.staging.yml up -d
                    '
                    """
                }
            }
        }

        stage('Manual Approval') {
            steps {
                input message: "Deploy to Kubernetes PRODUCTION?", ok: "Deploy"
            }
        }

        stage('Deploy to Kubernetes Prod') {
            steps {
                // This block uses the kubeconfig file you uploaded to Jenkins
                withCredentials([file(credentialsId: 'kubeconfig-id', variable: 'KUBECONFIG')]) {
                    sh """
                    # 1. Force Kubernetes to pull the 'latest' images again
                    kubectl rollout restart deployment frontend || true
                    kubectl rollout restart deployment contact-service || true
                    
                    # 2. Apply all Kubernetes manifests from your folder
                    # Assuming your manifests are in a folder named 'k8s'
                    kubectl apply -f k8s/
                    
                    # 3. Verify deployment status
                    kubectl get pods
                    kubectl get ingress
                    """
                }
            }
        }
    }
}
