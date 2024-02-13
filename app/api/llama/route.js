export const POST = async (request) => {
    //const { userId, prompt, tag } = await request.json();
    const { userId, name, description } = await request.json();
    console.log("name NEW ROUTE: " + name);
    console.log("description NEW ROUTE: " + description);
    try {
        await connectToDB();
        const newCollection = new FlashCardsCollections({
            creator: userId,
            name, 
            description 
        });

        await newCollection.save();
        console.log("Made it past save");
        return new Response(JSON.stringify(newCollection), { status: 201 })
    } catch (error) {
        return new Response("Failed to create a new prompt", { status: 500 });
    }
}