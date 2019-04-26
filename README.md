# AWS-NODE-UPLOAD-TO-S3

[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://github.com/guivirtuoso/aws-node-upload-to-s3/blob/master/LICENSE)

### Case
Enviar arquivos para o AWS S3 através de um ```<form/>``` HTML hospedado no próprio S3.

### Desafio
As requisições de POST para o S3 requerem algumas informações no ```<form/>``` para serem interpretadas como uma requisição confiável.

Para isto, devem estar no ```<form/>```, alguns campos ocultos são calculados a partir de credenciais válidas para a conta.

O desafio principal é gerar a policy corretamente em Base64 calculada com a aws signature key do usuário, que deve ser exatamente igual à estrutura enviada no html. Fonte: [http://docs.aws.amazon.com/pt_br/AmazonS3/latest/API/sigv4-HTTPPOSTConstructPolicy.html](http://docs.aws.amazon.com/pt_br/AmazonS3/latest/API/sigv4-HTTPPOSTConstructPolicy.html).

Este projeto facilita este trabalho, expondo de maneira simples os dados requeridos e gerando os HTML necessários.


### Pré-requisitos
- Criar um usuário no IAM apenas com ```Programmatic access``` e definir um grupo de permissões com acesso completo no S3 (Ex: AmazonS3FullAccess)

- Salvar os dados relacionados ao ```awsAccessKeyId``` e ```awsSecretAccessKey```, você irá precisar destas informações na próxima etapa

- Criar um bucket no S3 e [definir as propriedades de static website hosting](http://docs.aws.amazon.com/pt_br/AmazonS3/latest/user-guide/static-website-hosting.html)

- [Definir as permissões do Bucket](http://docs.aws.amazon.com/pt_br/gettingstarted/latest/swh/getting-started-configure-bucket.html#add-permissions) para o acesso web

- Instalar o [NodeJS](https://nodejs.org/en/download/)

### Configurações
- Definir as propriedades do arquivo ```/resources/aws.properties```

- Use os dados salvos no passo anterior para preencher as propriedades do usuário

- ```CUIDADO:``` Não salve em repositórios públicos suas informações de ```awsAccessKeyId``` e ```awsSecretAccessKey```

### Processo de build
Acessar a pasta do projeto via terminal e executar os comandos abaixo:
- ```npm install```

- ```node build.js```

### Instalação
- Fazer upload dos arquivos gerados no ```/target``` para o seu bucket

- Criar no bucket uma pasta com o mesmo nome definido na propriedade ```bucketDestinyFolder```

### Créditos
Adaptação do projeto de [Christoph Gysin](mailto:christoph.gysin@gmail.com) [(Github)](https://github.com/serverless/examples/tree/master/aws-node-upload-to-s3-and-postprocess)
