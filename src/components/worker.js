addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    const url = new URL(request.url)
    const apiUrl = url.searchParams.get('apiUrl')
    
    if (!apiUrl) {
        return new Response('Missing apiUrl parameter', { status: 400 })
    }

    const response = await fetch(apiUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body
    })

    const newResponse = new Response(response.body, response)
    newResponse.headers.set('Access-Control-Allow-Origin', '*')

    return newResponse
}