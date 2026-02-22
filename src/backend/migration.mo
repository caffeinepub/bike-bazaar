import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Text "mo:core/Text";

module {
  public type Condition = {
    #excellent;
    #good;
    #fair;
  };

  public type BikeListing = {
    id : Text;
    title : Text;
    brand : Text;
    model : Text;
    year : Nat;
    price : Nat;
    mileage : ?Nat;
    condition : Condition;
    description : Text;
    seller : Principal;
    contactInfo : Text;
    listingDate : Int;
    available : Bool;
  };

  public type Message = {
    id : Text;
    sender : Principal;
    receiver : Principal;
    content : Text;
    timestamp : Int;
    listingId : Text;
  };

  public type OldUserProfile = {
    name : Text;
    contactInfo : Text;
  };

  public type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    bikeListings : Map.Map<Text, BikeListing>;
    messages : Map.Map<Text, List.List<Message>>;
  };

  public type FounderProfile = {
    name : Text;
    address : Text;
    contactNumber : Text;
    emailAddress : Text;
    instagramProfile : Text;
  };

  public type NewUserProfile = {
    name : Text;
    contactInfo : Text;
  };

  public type NewActor = {
    founderEmail : Text;
    founderPrincipal : ?Principal;
    founderProfile : ?FounderProfile;
    userProfiles : Map.Map<Principal, NewUserProfile>;
    bikeListings : Map.Map<Text, BikeListing>;
    messages : Map.Map<Text, List.List<Message>>;
  };

  public func run(old : OldActor) : NewActor {
    {
      founderEmail = "rohitmarpalli@gmail.com";
      founderPrincipal = null;
      founderProfile = null;
      userProfiles = old.userProfiles;
      bikeListings = old.bikeListings;
      messages = old.messages;
    };
  };
};
