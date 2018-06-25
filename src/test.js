
import planetAvatarGenerator from './planetAvatarGenerator';

console.log("yippers"); 
planetAvatarGenerator(result => {
    const img = document.createElement('img');
    img.src = result;
    document.body.appendChild(img);
});
console.log("yepers"); 