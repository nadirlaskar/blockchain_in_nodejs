var BlockChain = new (require(`./BlockChain`))();
var app = require('express')();

app.get('/',(req,res)=>{
    res.send(BlockChain.chain);
});

app.get('/blockchain',(req,res)=>{
    res.send({
        length: BlockChain.chain.length,
        chain: BlockChain.chain
    });
});

app.get('/status',(req,res)=>{
    res.send("The system is under development.");
});

app.get('/mine/:data',(req,res)=>{
    var prev_block = BlockChain.get_previous_block();
    var prev_proof =  prev_block.proof;
    var proof = BlockChain.proof_of_work(prev_proof);
    var prev_hash = BlockChain.hash(prev_block);
    var block = BlockChain.create_block(proof,prev_hash,req.params.data);
    res.send({
        message: `Congrats, Block ${block.index} is successfully mined !`,
        block : block
    });
});

app.listen(process.env.PORT || 3000, () => console.log('Blockchain app listening on port 3000!'))