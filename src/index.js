const app=require('./app');

async function main(){
    try {
        await app.listen(process.env.PORT||4000);
        console.log('Server on port :'+app.get('port'));
    } catch (error) {
        console.log(error);
    }
}

main();