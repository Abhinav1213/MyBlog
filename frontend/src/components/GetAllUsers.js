
export const allUsers=async(setAllUsers)=>{
    try{
        const response=await fetch('http://localhost:8080/user/allnames',{
            method:'GET',
            headers:{
                'Content-Type':'application/json'
            }
        })
        const data =await response.json();
        // console.log(data);
        setAllUsers(data)
    }catch(err){
        console.log('Error with fetching allUsers username.');
    }
}