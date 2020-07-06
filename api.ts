import {Router, Context} from "https://deno.land/x/oak@v5.0.0/mod.ts"
import * as planetsHabitable from "./models/planets.ts"
import * as launches from "./models/launches.ts"

const router = new Router();

router.get("/",(ctx)=>{
    ctx.response.body = 'Nasa MISSION'
})

router.get("/planets",(ctx)=>{
   // ctx.throw(501,"Client not available")
    ctx.response.body = planetsHabitable.getAllPlanets();

})

router.get("/launches",(ctx)=>{
   // ctx.throw(501,"Client not available")
    ctx.response.body = launches.getAll();

})

router.delete("/launches/:id", (ctx) => {
    if (ctx.params?.id) {
      const result = launches.removeOne(Number(ctx.params.id));
      ctx.response.body = { success: result };
    }
  });

router.post("/launches",async(ctx)=>{
    const body= await ctx.request.body();
    launches.addOne(body.value);

    ctx.response.body ={ success : true};
    ctx.response.status = 201;
})

export default router;