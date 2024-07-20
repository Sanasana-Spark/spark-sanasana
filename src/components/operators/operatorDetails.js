/* eslint-disable react/prop-types */
import { React, useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography } from '@mui/material';
import Loader from '../loader'

const PropCard = ({ selectedOperator }) => {





  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (selectedOperator) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [selectedOperator]);
  

  return (
    <>
  
        {!loading && (
          
              <div>
                 {selectedOperator.map((Operator) => ( <>

                  <Card style={{ height: '400px', width: '100%' }}>
                  <Typography >Image</Typography>

                  </Card>
             
        
              <Card variant="outlined" style={{ marginTop: '20px' }}>
             
              <CardContent>
  <Grid container spacing={2}>
    <Grid item xs={6}>
      <Typography >Name:</Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography>{Operator.o_name}</Typography>
    </Grid>

    <Grid item xs={6}>
      <Typography>Status:</Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography>{Operator.o_status}</Typography>
    </Grid>


    <Grid item xs={6}>
      <Typography>cum mileage:</Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography>{Operator.o_cum_mileage}</Typography>
    </Grid>

    <Grid item xs={6}>
      <Typography>Phone:</Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography>{Operator.o_phone}</Typography>
    </Grid>

    <Grid item xs={6}>
      <Typography>Expirence:</Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography>{Operator.o_expirence}</Typography>
    </Grid>

  </Grid>
</CardContent>
                
              </Card></>

))}
            </div>
           
        )}
        
        { loading && ( <Loader/>
        )}
     
    </>
  );
};

export default PropCard;
