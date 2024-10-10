const Code=require('../models/Code');

const getCode=async(req,res)=>{
    try{
        const {id,language}=req.query;
        console.log(decodeURIComponent(language));
        const code=await Code.findOne({room:id,language:language});
        if(!code){
            let codeValue='';
            if(language==='javascript'){
                codeValue="console.log('Hello Worlds')";
            }
            else if(language==='python'){
                codeValue="print('Hello World')";
            }
            else if(language==='java'){
                codeValue="public class HelloWorld{public static void main(String[] args){System.out.println('Hello World');}}";
            }
            else if(language==="C++(Clang 7.0.1)"){
                codeValue="#include<iostream>using namespace std;int main(){cout<<'Hello World'<<endl;return 0;}";
            }
            const newCode=await Code.create({
                room:id,
                language:language,
                code:codeValue
            })
            return res.status(201).json({code:newCode});
        }
        return res.status(200).json({code});
    }catch(err){
        console.log(err);
        return res.status(400).json({msg:"Error in fetching the code"})
    }
}

module.exports={getCode};