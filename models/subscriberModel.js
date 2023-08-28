const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const { Schema } = mongoose;

const subscriberSchema = new Schema({

  fileNumber: {
    type: String,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, "Please add a password"]
  },
  residentialAddress: {
    type: String,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  altPhoneNumber: {
    type: String,
    trim: true
  },
  nokName: {
    type: String,
    trim: true
  },
  nokEmail: {
    type: String,
    trim: true
  },
  nokResidentialAddress: {
    type: String,
    trim: true
  },
  nokPhoneNumber: {
    type: String,
    trim: true
  },
  nokRelationship: {
    type: String,
    trim: true
  },
  coName: {
    type: String,
    trim: true
  },
  coEmail: {
    type: String,
    trim: true
  },
  coPhoneNumber: {
    type: String,
    trim: true
  },
  coResidentialAddress: {
    type: String,
    trim: true
  },
  nameOfEntry: {
    type: String,
    trim: true
  },
  rcNumber: {
    type: String,
    trim: true
  },
  typeOfBusiness: {
    type: String,
    trim: true
  },
  officeAddress: {
    type: String,
    trim: true
  },
  aoName: {
    type: String,
    trim: true
  },
  aoEmail: {
    type: String,
    trim: true
  },
  aoResidentialAddress: {
    type: String,
    trim: true
  },
  aoPhoneNumber: {
    type: String,
    trim: true
  },
}, {
  timestamps: true,
});


// encrypt password
subscriberSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next()
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(this.password, salt)
  this.password = hash
  next()
})

subscriberSchema.methods.toJSON = function () {
  const subscriber = this.toObject();
  if (subscriber.isIndividual) {
    // Return only these fields if isIndividual is true and isCoOwner is false
    if (!subscriber.isCoOwner) {
      return {
        name: subscriber.name,
        email: subscriber.email,
        fileNumber: subscriber.fileNumber,
        residentialAddress: subscriber.residentialAddress,
        phoneNumber: subscriber.phoneNumber,
        altPhoneNumber: subscriber.altPhoneNumber,
        nokName: subscriber.nokName,
        nokEmail: subscriber.nokEmail,
        nokResidentialAddress: subscriber.nokResidentialAddress,
        nokPhoneNumber: subscriber.nokPhoneNumber,
        nokRelationship: subscriber.nokRelationship,
        isIndividual: subscriber.isIndividual,
        isCorporate: subscriber.isCorporate,
        isCoOwner: subscriber.isCoOwner
      };
    }
    // Return these fields if isIndividual and isCoOwner are both true
    else {
      return {
        name: subscriber.name,
        email: subscriber.email,
        fileNumber: subscriber.fileNumber,
        residentialAddress: subscriber.residentialAddress,
        phoneNumber: subscriber.phoneNumber,
        altPhoneNumber: subscriber.altPhoneNumber,
        nokName: subscriber.nokName,
        nokEmail: subscriber.nokEmail,
        nokResidentialAddress: subscriber.nokResidentialAddress,
        nokPhoneNumber: subscriber.nokPhoneNumber,
        nokRelationship: subscriber.nokRelationship,
        coName: subscriber.coName,
        coEmail: subscriber.coEmail,
        coPhoneNumber: subscriber.coPhoneNumber,
        coResidentialAddress: subscriber.coResidentialAddress,
        isIndividual: subscriber.isIndividual,
        isCorporate: subscriber.isCorporate,
        isCoOwner: subscriber.isCoOwner
      };
    }
  } else {
    // Return all fields if isCorporate is true
    return {
      nameOfEntry: subscriber.nameOfEntry,
      fileNumber: subscriber.fileNumber,
      rcNumber: subscriber.rcNumber,
      phoneNumber: subscriber.phoneNumber,
      email: subscriber.email,
      typeOfBusiness: subscriber.typeOfBusiness,
      officeAddress: subscriber.officeAddress,
      aoName: subscriber.aoName,
      aoEmail: subscriber.aoEmail,
      aoResidentialAddress: subscriber.aoResidentialAddress,
      aoPhoneNumber: subscriber.aoPhoneNumber,
      isIndividual: subscriber.isIndividual,
      isCorporate: subscriber.isCorporate,
      isCoOwner: subscriber.isCoOwner
    };
  }
};



const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = Subscriber;
