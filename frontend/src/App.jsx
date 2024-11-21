import React, { useState, useEffect } from 'react'; 
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { Container, Typography, Button, TextField, Card, CardContent, CardMedia, Grid, CircularProgress } from '@mui/material'

const DAPP_VOTES_ADDRESS = '0xAA292E8611aDF267e563f334Ee42320aC96D0463';
const DAPP_VOTES_ABI  = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "voter",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "Voted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "image",
        "type": "string"
      }
    ],
    "name": "contest",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "image",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "startAt",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "endAt",
        "type": "uint256"
      }
    ],
    "name": "createPoll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "deletePoll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "getAllContestants",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "image",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "voter",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "votes",
            "type": "uint256"
          },
          {
            "internalType": "address[]",
            "name": "voters",
            "type": "address[]"
          }
        ],
        "internalType": "struct DappVotes.ContestantStruct[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllPolls",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "image",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "votes",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "contestants",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "deleted",
            "type": "bool"
          },
          {
            "internalType": "address",
            "name": "director",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "startsAt",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "endAt",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "address[]",
            "name": "voters",
            "type": "address[]"
          },
          {
            "internalType": "string[]",
            "name": "avatars",
            "type": "string[]"
          }
        ],
        "internalType": "struct DappVotes.PollStruct[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "cid",
        "type": "uint256"
      }
    ],
    "name": "getContestant",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "image",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "voter",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "votes",
            "type": "uint256"
          },
          {
            "internalType": "address[]",
            "name": "voters",
            "type": "address[]"
          }
        ],
        "internalType": "struct DappVotes.ContestantStruct",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "getPoll",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "image",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "votes",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "contestants",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "deleted",
            "type": "bool"
          },
          {
            "internalType": "address",
            "name": "director",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "startsAt",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "endAt",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "address[]",
            "name": "voters",
            "type": "address[]"
          },
          {
            "internalType": "string[]",
            "name": "avatars",
            "type": "string[]"
          }
        ],
        "internalType": "struct DappVotes.PollStruct",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "image",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "startAt",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "endAt",
        "type": "uint256"
      }
    ],
    "name": "updatePoll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "cid",
        "type": "uint256"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];


const App = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', description: '', image: '', startAt: '', endAt: '' });

  // connect to wallet
  useEffect(() => {
    const init = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        const web3Instance = new Web3(provider);
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.requestAccounts();
        setAccount(accounts[0]);
        console.log('Account:', accounts[0]);

        const contractInstance = new web3Instance.eth.Contract(DAPP_VOTES_ABI, DAPP_VOTES_ADDRESS);
        setContract(contractInstance);
        console.log('Contract:', contractInstance);

        fetchPolls(contractInstance);


        provider.on('accountsChanged', (accounts) => {
          setAccount(accounts[0]);
          console.log('Account changed:', accounts[0]);
        });
        

        provider.on('chainChanged', () => {
          window.location.reload(); 
        });
      } else {
        alert("Please install MetaMask!");
      }
    };

    init();
  }, []);


  const fetchPolls = async (contractInstance) => {
    try {
      const pollsCount = await contractInstance.methods.totalPolls().call();
      console.log('Total Polls:', pollsCount);
      const pollsData = [];

      for (let i = 1; i <= pollsCount; i++) {
        const poll = await contractInstance.methods.getPoll(i).call();
        if (!poll.deleted) {
          pollsData.push(poll);
        }
      }
      
      setPolls(pollsData);
      setLoading(false);
      console.log('Polls:', pollsData);
    } catch (err) {
      console.error("Error fetching polls:", err);
      setLoading(false);  
    }
  };

  const createPoll = async () => {
    const { title, description, image, startAt, endAt } = formData;
    try {
      await contract.methods.createPoll(image, title, description, startAt, endAt)
        .send({ from: account });
      fetchPolls(contract);
      setFormData({ title: '', description: '', image: '', startAt: '', endAt: '' });
    } catch (err) {
      console.error("Error creating poll:", err);
    }
  };


  const vote = async (pollId, contestantId) => {
    try {
      await contract.methods.vote(pollId, contestantId)
        .send({ from: account });
      fetchPolls(contract);
    } catch (err) {
      console.error("Error voting:", err);
    }
  };

  const connectWallet = async () => {
    try {
      const provider = await detectEthereumProvider();
      if (provider) {
        const web3Instance = new Web3(provider);
        const accounts = await web3Instance.eth.requestAccounts();
        setAccount(accounts[0]);
      } else {
        alert("Please install MetaMask!");
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
    }
  };


  const disconnectWallet = () => {
    setAccount(null);
    setWeb3(null);
    setContract(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreatePoll = (e) => {
    e.preventDefault();
    createPoll();
  };

  const handleVote = (pollId, contestantId) => {
    vote(pollId, contestantId);
  };

  if (loading) return <CircularProgress />;

  return (
    <Container>
      <Typography variant="h3" gutterBottom>Welcome to Dapp Votes</Typography>
      {account ? (
        <>
          <Typography variant="body1">Connected Account: {account}</Typography>
          <Button variant="contained" color="secondary" onClick={disconnectWallet}>Disconnect Wallet</Button>
        </>
      ) : (
        <Button variant="contained" color="primary" onClick={connectWallet}>Connect Wallet</Button>
      )}

      <form onSubmit={handleCreatePoll} style={{ marginTop: 20 }}>
        <Typography variant="h5" gutterBottom>Create New Poll</Typography>
        <TextField
          fullWidth
          margin="normal"
          name="title"
          label="Poll Title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          name="description"
          label="Poll Description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          name="image"
          label="Image URL"
          value={formData.image}
          onChange={handleInputChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          name="startAt"
          label="Start Time (Timestamp)"
          type="number"
          value={formData.startAt}
          onChange={handleInputChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          name="endAt"
          label="End Time (Timestamp)"
          type="number"
          value={formData.endAt}
          onChange={handleInputChange}
          required
        />
        <Button type="submit" variant="contained" color="primary">Create Poll</Button>
      </form>

      <Typography variant="h4" gutterBottom style={{ marginTop: 40 }}>Active Polls</Typography>
      {polls.length > 0 ? (
        <Grid container spacing={4}>
          {polls.map((poll) => (
            <Grid item xs={12} md={6} lg={4} key={poll.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={poll.image}
                  alt={poll.title}
                />
                <CardContent>
                  <Typography variant="h5">{poll.title}</Typography>
                  <Typography variant="body1">{poll.description}</Typography>
                  <Typography variant="h6" gutterBottom style={{ marginTop: 20 }}>Contestants</Typography>
                  {poll.contestants > 0 ? (
                    poll.avatars.map((avatar, index) => (
                      <div key={index}>
                        <CardMedia
                          component="img"
                          height="50"
                          image={avatar}
                          alt="contestant"
                          style={{ borderRadius: '50%', width: '50px', height: '50px' }}
                        />
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleVote(poll.id, index + 1)}
                          style={{ marginTop: 10 }}
                        >
                          Vote
                        </Button>
                      </div>
                    ))
                  ) : (
                    <Typography variant="body2">No contestants yet</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1">No active polls</Typography>
      )}
    </Container>
  );
};

export default App;
