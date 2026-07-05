import express from 'express';
import authRoutes from '../auth.js';
import profileRoutes from '../profiles.js';
import matchRoutes from '../matches.js';
import messageRoutes from '../messages.js';
import storyRoutes from '../stories.js';
import giftRoutes from '../gifts.js';
import creditRoutes from '../credits.js';
import notificationRoutes from '../notifications.js';
import safetyRoutes from '../safety.js';
import streamerRoutes from '../streamer.js';
import userStatusRoutes from '../userStatus.js';
import agoraRoutes from '../agora.js';
import wishlistRoutes from '../wishlist.js';
import settingsRoutes from '../settings.js';
import vipRoutes from '../vip.js';
import translateRoutes from '../translate.js';
import compatibilityRoutes from '../compatibility.js';
import stripeReturnRoutes from './stripeReturn.js';

/**
 * Mobile app API — mirrors /api/* under /api/mobile/*.
 * Sets req.clientPlatform = 'mobile' for Stripe redirects and auth behaviour.
 */
export default function createMobileApiRouter(io) {
  const router = express.Router();

  router.use((req, res, next) => {
    req.clientPlatform = 'mobile';
    next();
  });

  router.get('/health', (req, res) => {
    res.json({ status: 'ok', platform: 'mobile', timestamp: new Date().toISOString() });
  });

  router.get('/config', (req, res) => {
    res.json({
      platform: 'mobile',
      apiPrefix: '/api/mobile',
    });
  });

  router.use('/stripe', stripeReturnRoutes);
  router.use('/auth', authRoutes);
  router.use('/profiles', profileRoutes);
  router.use('/matches', matchRoutes);
  router.use('/messages', (req, res, next) => {
    req.io = io;
    next();
  }, messageRoutes);
  router.use('/stories', storyRoutes);
  router.use('/gifts', (req, res, next) => {
    req.io = io;
    next();
  }, giftRoutes);
  router.use('/credits', creditRoutes);
  router.use('/notifications', notificationRoutes);
  router.use('/safety', safetyRoutes);
  router.use('/streamer', streamerRoutes);
  router.use('/user', userStatusRoutes);
  router.use('/agora', agoraRoutes);
  router.use('/wishlist', wishlistRoutes);
  router.use('/settings', settingsRoutes);
  router.use('/vip', vipRoutes);
  router.use('/translate', translateRoutes);
  router.use('/compatibility', compatibilityRoutes);

  return router;
}
