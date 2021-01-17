const nodemailer = require('nodemailer');
transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user:'vishalcool.vaitheeswaran@gmail.com',
        pass:'ind-pplmt0000382'
    },
});

EmailTemplate = require('email-templates').EmailTemplate;
path = require('path');
Promise = require('bluebird');

function sendEmail (obj) {
    return transporter.sendMail(obj);
}

function loadTemplate (templateName, contexts){
    let template = new EmailTemplate(path.join(__dirname,'templates',templateName));
    return Promise.all(contexts.map((context)=>{
        return new Promise((resolve, reject)=>{
            template.render(context, (err, result)=>{
                if(err) reject(err);
                else resolve({
                    email: result,
                    context,
                });
            })
        })
    }));
}


exports.handler = async (event)=>{
    console.log(event.queryStringParameters)
    const {name} = event.queryStringParameters;
    const {email} = event.queryStringParameters;
    const {phone} = event.queryStringParameters;
    const {courses} = event.queryStringParameters;
    // console.log(event.queryStringParameters)
    let users =[
        {
          "name": `${name}`,
          "phone": `${phone}`,
          "email": `${email},prismprojects7@gmail.com`,
          "courses": `${courses}`,
        },
        // {
        //     "name": `Vishal`,
        //     "phone": `8667428082`,
        //     "email": `vishalvrk97@gmail.com`,
        //     "courses": `Java`,
        //   },
       ]

      
    loadTemplate('welcome',users).then((results)=>{
        return Promise.all(results.map((result)=>{
        sendEmail({
                to: result.context.email,
                from:'Prism Projects :)',
                subject:result.email.subject,
                html: result.email.html,
                text: result.email.text
            });
            console.log(result.context.email);
        }))
    }).then(()=>{
        console.log('Yay!');
    }).catch((err)=>{
        console.log(err);
    })

    return{
        statusCode: 200,
        body:  `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sample Site</title>

    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css">
    <style>
        body { padding-top:50px; }
    </style>
</head>
<body>

    <div class="container">
        <div class="jumbotron">
            <h1>Email sent successfully ${name} !</h1>
            <a href="/">Return to prismproject.in</a>
        </div>
    </div>

</body>
</html>
        `
    }

    
}