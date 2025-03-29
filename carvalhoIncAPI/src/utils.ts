function logger(...data){
    console.log(data, `at ${new Date().toLocaleString()}`);
}

export { logger };