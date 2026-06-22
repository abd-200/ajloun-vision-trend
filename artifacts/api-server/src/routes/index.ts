import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import initiativesRouter from "./initiatives";
import membersRouter from "./members";
import knowledgeRouter from "./knowledge";
import statsRouter from "./stats";
import postsRouter from "./posts";
import opportunitiesRouter from "./opportunities";
import pointsRewardsRouter from "./pointsRewards";
import notificationsRouter from "./notifications";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(initiativesRouter);
router.use(membersRouter);
router.use(knowledgeRouter);
router.use(statsRouter);
router.use(postsRouter);
router.use(opportunitiesRouter);
router.use(pointsRewardsRouter);
router.use(notificationsRouter);
router.use(adminRouter);

export default router;
