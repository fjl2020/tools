const bcrypt= require('bcrypt');
const helpers={};

helpers.encryptPassword=async (password)=>{
    // console.log(password);
    const salt=await bcrypt.genSalt(10);
    // console.log(salt);
    const finalPass =await bcrypt.hash(password,salt);
    // console.log(finalPass);
    return finalPass;   
};
helpers.matchPassword=async(password,passdb)=>{
    
    try{

        const result=bcrypt.compare(password,passdb);
        return result;
    }catch(e)
    {
        return false;
        console.log(e);
    }
    

}
helpers.tsToStr=(ts)=>{
        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
        var date = new Date(ts );
        // Hours part from the timestamp
        var hours = date.getHours();
        // Minutes part from the timestamp
        var minutes = "0" + date.getMinutes();
        // Seconds part from the timestamp
        var seconds = "0" + date.getSeconds();
        //
        var days=date.getDate();
        var month=date.getMonth()+1;
        var fullYear=date.getFullYear()
        
        // Will display time in 10:30:23 format
        var formattedTime =fullYear+"-"+month+"-"+days+" "+ hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        return formattedTime;
}
module.exports=helpers;