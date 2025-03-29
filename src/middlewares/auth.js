const adminAuth = (req,res,next) => {
    console.log("Admin auth is running");
    const token = "abhh";
    const isauth = token === "abhh";
    if(!isauth){
        res.status(401).send("Unauthorised access");
    }else{
        next();
    }
}

const userAuth = (req,res,next) => {
    console.log("User auth is running");
    const token = "abhh";
    const isauth = token === "abhh";
    if(!isauth){
        res.status(401).send("Unauthorised access");
    }else{
        next();
    }
}

module.exports = {
    adminAuth,
    userAuth,
}
