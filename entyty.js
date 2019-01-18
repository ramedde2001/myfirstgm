class entyty
{
constractor()
{

}
colide(p)
{
	if(this.getdistence(p)<10)
		return true;
	else 
		return false;
	
}
getdistence(p)
{
	var vec={x:p.x-this.x,z:p.z-this.z}
var lent=Math.sqrt(vec.x*vec.x+vec.z*vec.z);
return lent;
	
}



}