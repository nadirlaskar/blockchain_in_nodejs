var BlockChain = new (require(`./BlockChain`))();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const uuid = require('uuid/v4');
const node_address = uuid().replace(/[\-]/g,'');
var MINE_REWARD = 10;


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.get('/',(req,res)=>{
    res.send({ address: node_address, nodes: BlockChain.nodes});
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

app.get('/mine',(req,res)=>{
    var prev_block = BlockChain.get_previous_block();
    var prev_proof =  prev_block.proof;
    var proof = BlockChain.proof_of_work(prev_proof);
    var prev_hash = BlockChain.hash(prev_block);
    BlockChain.addTransaction(node_address,node_address,MINE_REWARD);
    var block = BlockChain.create_block(proof,prev_hash);
    res.send({
        message: `Congrats, Block ${block.index} is successfully mined !`,
        block : block
    });
});

app.get('/isValid',(req,res)=>{
    res.send(BlockChain.isChainValid()?"Yes, blockchain is in valid state":"No, blockchain is not in valid state.")
});

app.post('/addTransaction',(req,res)=>{
    var postData = req.body;
    var block_index = -1;
    if(postData.sender&&postData.receiver&&postData.amount){
        block_index = BlockChain.addTransaction(postData.sender,postData.receiver,postData.amount);
        res.send({status: `Transaction will be added to block ${block_index}`});
    }
    else res.send({status: "Corrupted Transaction Submitted. Error" },201);
});



// Create New Nodes For Decentralized Blockchain
app.post('/connectNode',(req,res)=>{
    var postData = req.body;
    var nodes = postData.nodes;
    if(nodes){
        nodes.forEach(node => {
            BlockChain.add_node(node);
        });
        res.send({status: `Nodes Added Successfully`});
    }else res.send({status: "Connection Aborted. Error" },201);
});

app.get('/replaceChain',(req,res)=>{
    BlockChain.replace_chain().then((isChainReplaced)=>{
    if(isChainReplaced){
        res.send({
                    status: `The blockchain is replaced by the longest chain.`,
                    chain:  BlockChain.chain
                });
        }else{
            res.send({ 
                        status : `Block chain is not required to be replaced.`,
                        chain: BlockChain.chain
                    });
        }
    });
});

console.log(`My address is ${node_address}`);
PORT = 3000;
app.listen(process.env.PORT || PORT, () => console.log(`Blockchain app listening on port ${PORT}!`));