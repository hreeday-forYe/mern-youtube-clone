
// Async Handler for promises
const asyncHandler = (requestHandler) =>{
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err)=>{next(err)})
  }
}

export{asyncHandler}



// Try catch Async Handler

/*
const asyncHandler1 = (fn)=> async (err, req, res, next)=>{
  try {
    await fn(req, res, next)
  } catch (err) {
    res.status(err.code || 500).json({
      success: false,
      message: err.message
    })
  }
}
*/