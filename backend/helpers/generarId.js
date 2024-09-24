const generarId = () =>{
    const random = Math.random().toString(32).slice(2);
    const date = Date.now().toString(32);

    return random + date;
}

export default generarId;