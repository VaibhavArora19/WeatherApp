module.exports =  getDate;

function getDate()
{
    let today = new Date();
    const date = today.toLocaleDateString();
    return date;
}
getDate();