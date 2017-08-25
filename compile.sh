docker build -t blueapp/proxy:0.0.2 . &&
kubectl scale --replicas=0 deployment deployment --namespace=proxy &&
kubectl scale --replicas=2 deployment deployment --namespace=proxy
