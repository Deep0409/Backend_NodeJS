const asyncHandler=(reqHandler)=>{
   (req, res,next)=>{
    Promise.resolve(reqHandler(req,res,next))
    .catch((err)=>next(err));
   }
}

export {asyncHandler}

// we can also implement above method with the try catch rather than promise below is the implementation.
// const asyncHandler=(reqHandler)=>async(req,res,next)=>{
//     try {
//         await reqHandler(req,res,next);
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success:false,
//             error:error.message
//         })
//     }
// }