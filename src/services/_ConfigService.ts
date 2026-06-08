import api from './_api';

const PREFIX = '/config';

const _ConfigServiceFactory = () => {
    const getGoalStatusIds = (): Promise<{ statusIds: number[] }> =>
        api.get(`${PREFIX}/goal-status-ids`);

    return { getGoalStatusIds };
};

export default _ConfigServiceFactory;
