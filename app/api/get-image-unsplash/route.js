// pages/api/wiki.js



export const GET = async (req,res) => {
    console.log("api/search/photos.js GET STATIC");
    const urlQuery = new URL(req.url)
    const searchQuery = urlQuery.searchParams.get("query")
    console.log(searchQuery);
    
    const testENV = process.env.TEST_ENV;
    console.log(testENV);
     
     const test = "alaska"
     const unsplashID = process.env.UNSPLASH_ID;
     const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;
   

     const url2 = `https://api.unsplash.com/search/photos?client_id=lDmCcc5OFUPJY133A1a9r91wF7mtzk-4JuOEhdIE7-o&query=${searchQuery}`
     const url3 = `https://api.unsplash.com/search/photos?client_id=${unsplashID}&query=${searchQuery}`
     const url = `https://api.unsplash.com/search/photos?client_id=${unsplashAccessKey}&query=${searchQuery}`

     //const url = `https://api.unsplash.com/search/photos?client_id=lDmCcc5OFUPJY133A1a9r91wF7mtzk-4JuOEhdIE7-o`
     console.log("pizza time");
     console.log(req.url.query);
     //const {query} = new URL(req.url)
      //console.log(query);
   
     try {
       const response = await fetch(url);
       const data = await response.json();
       console.log(data);
       console.log(typeof data);
    //    const pageId = Object.keys(data.query.pages)[0];
    //    const introParagraph = data.query.pages[pageId].extract;
 
        const photo = data.results[0].urls.regular
 
    //    return new Response(JSON.stringify(introParagraph), { status: 200 })
        // res.statusCode = 200; 
        // return res.json(data);
        return new Response(JSON.stringify(data), { status: 200 })
        //return new Response(data, { status: 200 })
        //return photo
     } catch (error) {
       console.error('Error:', error);
       res.status(500).json({ error: 'An error occurred' });
     }
   }
   