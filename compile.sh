docker build -t wildapplications/proxy:latest . &&
kubectl scale --replicas=0 deployment deployment --namespace=proxy &&
kubectl scale --replicas=2 deployment deployment --namespace=proxy
