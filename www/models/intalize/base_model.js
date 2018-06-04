"use strict";

const timeUtils = require('../../utils/time_utils');
const PROMISE = require('bluebird');
const OBJECT_ID = require('mongoose').Types.ObjectId;

class BaseModel {
    /**
     * @return {number}
     */
    static get FIND_ONE() {
        return 1
    }

    /**
     * @return {number}
     */
    static get FIND_MANY() {
        return 2
    }

    /**
     * @return {number}
     */
    FIND_ONE() {
        return 1
    }

    /**
     * @return {number}
     */
    FIND_MANY() {
        return 2
    }

    constructor(collection) {
        this.coll = collection;
    }

    updateById(id, updatedata) {
        let coll = this.coll;
        return new PROMISE(function (resolve) {
            updatedata.UpdateAt = timeUtils.getCurrentTime();
            coll.update({_id: OBJECT_ID(id)}, updatedata, function (error) {
                return resolve(error);
            })
        });
    }

    insertData(data) {
        let coll = this.coll;
        return new PROMISE(function (resolve) {
            data.UpdateAt = timeUtils.getCurrentTime();
            data.CreateAt = timeUtils.getCurrentTime();

            (new coll(data)).save(function (error, result) {
                return resolve(result);
            });
        });
    }

    updateWhereClause(condition, updatedata) {
        let coll = this.coll;
        return new PROMISE(function (resolve) {
            updatedata.UpdateAt = timeUtils.getCurrentTime();
            coll.update(condition, updatedata, function (error) {
                return resolve(error);
            })
        });
    }

    getAllData() {
        let coll = this.coll;
        return new PROMISE(function (resolve) {
            coll.find({}).exec().then(function (result) {
                return resolve(result);
            })
        });
    }

    getDocumentLatestUpdate() {
        let coll = this.coll;
        return new PROMISE(function (resolve) {
            coll.findOne({}).sort({UpdateAt: -1}).exec().then(function (result) {
                return resolve(result);
            })
        });
    }

    getDocumentLatestUpdateWhere(condition) {
        let coll = this.coll;
        return new PROMISE(function (resolve) {
            coll.findOne(condition).sort({UpdateAt: -1}).exec().then(function (result) {
                return resolve(result);
            })
        });
    }

    getDocumentOldUpdate() {
        let coll = this.coll;
        return new PROMISE(function (resolve) {
            coll.findOne({}).sort({UpdateAt: 1}).exec().then(function (result) {
                return resolve(result);
            })
        });
    }

    getDocumentLatestCreate() {
        let coll = this.coll;
        return new PROMISE(function (resolve) {
            coll.findOne({}).sort({CreateAt: -1}).exec().then(function (result) {
                return resolve(result);
            })
        });
    }

    getDocumentOldCreate() {
        let coll = this.coll;
        return new PROMISE(function (resolve) {
            coll.findOne({}).sort({CreateAt: 1}).exec().then(function (result) {
                return resolve(result);
            })
        });
    }

    countDataWhere(condition) {
        let coll = this.coll;
        return new PROMISE(function (resolve) {
            coll.count(condition, function (error, count) {
                return resolve(count);
            })
        });
    }


    getDataById(id) {
        let coll = this.coll;
        return new PROMISE(function (resolve) {
            coll.find({_id: OBJECT_ID(id)}).exec().then(function (result) {
                if (result === null) {
                    return resolve(null);
                } else {
                    return resolve(result[0]);
                }
            })
        });
    }

    getDataWhere(whereClause, findType, sort = null, limit = null) {
        let coll = this.coll;
        return new PROMISE(function (resolve) {
            if (BaseModel.FIND_ONE == findType) {
                if (sort != null) {
                    coll.findOne(whereClause).sort(sort).exec().then(function (result) {
                        return resolve(result);
                    })
                } else {
                    coll.findOne(whereClause).sort(sort).exec().then(function (result) {
                        return resolve(result);
                    })
                }

            } else if (BaseModel.FIND_MANY == findType) {
                if (sort != null) {
                    if (limit != null) {
                        coll.find(whereClause).sort(sort).limit(limit).exec().then(function (result) {
                            return resolve(result);
                        })
                    } else {
                        coll.find(whereClause).sort(sort).exec().then(function (result) {
                            return resolve(result);
                        })
                    }

                } else {
                    if (limit != null) {
                        coll.find(whereClause).sort(sort).limit(limit).exec().then(function (result) {
                            return resolve(result);
                        })
                    } else {
                        coll.find(whereClause).sort(sort).exec().then(function (result) {
                            return resolve(result);
                        })
                    }
                }
            }
        });
    }

    removeDataWhere(condition) {
        let coll = this.coll;
        return new PROMISE(function (resolve) {
            coll.remove(condition, function (error) {
                return resolve();
            })
        });
    }
}

module.exports = BaseModel;