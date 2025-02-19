
// export const deleteNotification = () => {
//     cron.schedule(CRON_MID_NIGHT_TIME_STAMP, async() => {
//         const thirtyDays= thirtyDaysAgo();
//         await Notification.deleteMany({
//             status: NOTIFICATION_DEFAULT_STATUS.Read, 
//             createdAt: {
//                 $lt: thirtyDays
//             }
//         });
//         console.log('Deleted notifications with read status');
//     })
// }