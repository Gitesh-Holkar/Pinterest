const TryCatch = (handler) =>{
    return async (req,res,next)=> {
        try {
            console.log(req);
            await handler(req,res,next);
        } catch (error) {
                res.status(500).json({
                    message:error.message
                })
            }   
    }
   
    }

    export default TryCatch;
