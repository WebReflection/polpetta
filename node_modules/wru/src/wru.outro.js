    
    TIMEOUT *= TIMEOUT; // by default, timeout is 10000 (10 seconds)
                        // this is the place you can set it, e.g.
                        // TIMEOUT = 2000; // 2 seconds
    
    wru.random = FALSE; // by default tests order is preseverd
                        // set wru.random = TRUE to randomly sort them
    
    return wru;
    
}(this);