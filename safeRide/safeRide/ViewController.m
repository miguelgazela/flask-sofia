//
//  ViewController.m
//  safeRide
//
//  Created by Miguel Oliveira on 18/10/2016.
//  Copyright © 2016 Miguel Oliveira. All rights reserved.
//

#import "ViewController.h"

#import <Parse/PFObject.h>

@interface ViewController ()

@property (nonatomic, strong) CLLocationManager *locationManager;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
}


- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)startSharingLocation:(id)sender {
 
    
    if (self.locationSharingButton.isOn) {
        
        NSLog(@"Start sharing location...");
        
        if ([CLLocationManager authorizationStatus] == kCLAuthorizationStatusRestricted || [CLLocationManager authorizationStatus] == kCLAuthorizationStatusDenied) {
            
            NSLog(@"Permission denied to location services...");
            
            [self.locationSharingButton setOn:NO];
            return;
        }
        
        if (![CLLocationManager locationServicesEnabled]) {
            
            NSLog(@"Location services are not enabled...");
            
            [self.locationSharingButton setOn:NO];
            return;
        }
        
        self.locationManager = [[CLLocationManager alloc] init];
        self.locationManager.delegate = self;
        self.locationManager.desiredAccuracy = kCLLocationAccuracyBest;
        self.locationManager.distanceFilter = kCLDistanceFilterNone;
//        self.locationManager.distanceFilter = 5;
        
        if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 8.0) {
            [self.locationManager requestAlwaysAuthorization];
        }
        
        [self.locationManager setAllowsBackgroundLocationUpdates:YES];
        [self.locationManager startUpdatingLocation];
        
    } else {
        
        NSLog(@"Stop sharing location...");
        
        if (self.locationManager) {
            [self.locationManager stopUpdatingLocation];
            self.locationManager = nil;
        }
    }
}

- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray<CLLocation *> *)locations {
    
    // If it's a relatively recent event, turn off updates to save power.
    
    CLLocation *location = [locations lastObject];
    NSDate *eventDate = location.timestamp;
    
    NSLog(@"latitude %+.6f, longitude %+.6f\n",
          location.coordinate.latitude,
          location.coordinate.longitude);
    
    
    PFObject *object = [PFObject objectWithClassName:@"ride_location" dictionary:@{@"latitude": [NSNumber numberWithDouble:location.coordinate.latitude], @"longitude": [NSNumber numberWithDouble:location.coordinate.longitude], @"timestamp": location.timestamp, @"speed": [NSNumber numberWithDouble:location.speed]}];
    
    [object saveInBackgroundWithBlock:^(BOOL succeeded, NSError * _Nullable error) {}];
}


@end
