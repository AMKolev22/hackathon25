export async function addUserClient(name: string){
    try {
    const res = await fetch("/api/user", {
        method: "POST",
        body: JSON.stringify({
            username: name
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
    });
    if (res.ok){        
            const data = await res.json();
            return data;
        }
    } 
    catch (error){
        console.log(error);
    }
}